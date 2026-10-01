"""Import a read-only public-site snapshot. Usage: python import-content.py /path/to/original

Requires beautifulsoup4. The snapshot is deliberately kept outside this repository.
Only public text and assets are imported, never original executable JS or cookies.
"""
from pathlib import Path
from urllib.parse import urlsplit, urljoin, parse_qs, unquote
from bs4 import BeautifulSoup, Comment
import sys, json, re, shutil, hashlib

source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
content = root / 'src/content'
content.mkdir(parents=True, exist_ok=True)
manifest = json.loads((source/'manifest.json').read_text())
asset_map = {}

def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')

for url, relative in manifest.items():
    f = source / relative
    if f.suffix.lower() not in ['.png','.jpg','.jpeg','.webp','.svg','.ico','.woff2','.mp3','.mp4','.pdf']: continue
    parts = urlsplit(url)
    name = unquote(parts.path).lstrip('/')
    if parts.netloc == 'cdn.bukago.app':
        dest = '/assets/articles/'+hashlib.sha256(url.encode()).hexdigest()[:16]+f.suffix
    else:
        dest = '/assets/site/'+name
    target=root/'public'/dest.lstrip('/')
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(f,target)
    asset_map[url]=dest
    asset_map[urljoin('https://bukago.app',parts.path) if parts.netloc=='bukago.app' else url]=dest

def asset(src):
    if src.startswith('/_next/image?'):src=parse_qs(urlsplit(src).query)['url'][0]
    url=urljoin('https://bukago.app',src)
    return asset_map.get(url,src)

def href(src):
    parts=urlsplit(src)
    if parts.netloc and parts.netloc not in ['bukago.app','www.bukago.app']:return src
    path=parts.path
    if path=='/ru':path='/'
    if path.startswith('/legal/'):path='/ru'+path
    if path.startswith('/blog'):path='/ru'+path
    return path+(('?'+parts.query) if parts.query else '')+(('#'+parts.fragment) if parts.fragment else '')

def clean(tag):
    tag=BeautifulSoup(str(tag),'html.parser')
    for el in tag.select('script,style,noscript,form,button,input,object,embed'):el.decompose()
    for comment in tag.find_all(string=lambda t:isinstance(t,Comment)):comment.extract()
    for el in tag.find_all(True):
        cls=' '.join(el.get('class',[]))
        if el.name=='div' and '__block__paragraph' in cls:el.name='p'
        attrs={}
        for key in ['href','src','alt','title','id','colspan','rowspan','width','height','controls','poster']:
            if key in el.attrs:attrs[key]=el.attrs[key]
        if 'href' in attrs:
            attrs['href']=href(attrs['href'])
            if not re.match(r'^(https?://|mailto:|tel:|/|#)',attrs['href']):attrs.pop('href')
        for key in ['src','poster']:
            if key in attrs:
                attrs[key]=asset(attrs[key])
                if not re.match(r'^(https?://|/)',attrs[key]):attrs.pop(key)
        if el.name=='img':attrs.update(loading='lazy',decoding='async')
        if el.name in ['video','audio']:attrs['controls']=''
        if el.name=='iframe':
            if urlsplit(attrs.get('src','')).hostname not in ['www.youtube.com','www.youtube-nocookie.com','music.yandex.ru','vk.com']:el.decompose();continue
            attrs.update(loading='lazy',title=attrs.get('title','Media'),allowfullscreen='')
        el.attrs=attrs
    return ''.join(str(x) for x in tag.contents)

locales={'ru':'/','en':'/en','kk':'/kz','uz':'/uz','az':'/az'}
landing={}
for locale,path in locales.items():
    f=source/manifest['https://bukago.app'+path]
    soup=BeautifulSoup(f.read_text(),'html.parser')
    messages=None
    for script in soup.find_all('script'):
        text=script.string or ''
        if not text.startswith('self.__next_f.push([1,'):continue
        stream=json.loads(text.removeprefix('self.__next_f.push(').removesuffix(')'))[1]
        for line in stream.splitlines():
            if '"messages":' not in line:continue
            messages=json.loads(line.split(':',1)[1])[3]['messages']
    assert messages, f'No translations for {locale}'
    dump(content/'locales'/f'{locale}.json',messages)
    if locale=='ru':
        sections=soup.select('main > section')
        landing={
            'hero':asset(sections[0].select_one('img[alt="BukaGo"]')['src']),
            'features':[asset(el.select_one('img')['src']) for el in sections[1].find_all(recursive=False)],
            'problem':asset(sections[2].select_one('img')['src']),
            'connect':asset(sections[4].select_one('img[alt="BukaGo"]')['src']),
            'family':[asset(el['src']) for el in sections[5].select('img')],
            'download':asset(sections[6].select_one('img[alt="Телефон"]')['src']),
        }
dump(content/'media.json',landing)

pages=[]
for url,relative in manifest.items():
    f=source/relative
    if f.suffix!='.html':continue
    path=urlsplit(url).path.rstrip('/')
    if '/blog/' not in path and '/legal/' not in path:continue
    soup=BeautifulSoup(f.read_text(),'html.parser')
    article=soup.select_one('main article')
    if not article:continue
    title=article.find('h1').get_text(' ',strip=True)
    description=soup.find('meta',attrs={'name':'description'})
    body=article.select_one('div[class$="__content"]')
    if not body:raise ValueError('Missing content: '+url)
    image=article.select_one('header img')
    updated=article.select_one('header p')
    data={}
    for ld in soup.find_all('script',attrs={'type':'application/ld+json'}):
        candidate=json.loads(ld.string) if ld.string else {}
        if candidate.get('@type')=='BlogPosting':data=candidate
    item={
        'path':path,'kind':'legal' if '/legal/' in path else 'article',
        'locale':'kk' if path.startswith('/kz') else path.split('/')[1],
        'title':title,'description':description['content'] if description else '',
        'body':clean(body),'cover':asset(image['src']) if image else None,
        'published':data.get('datePublished',''),'modified':data.get('dateModified',''),
        'updated':updated.get_text(' ',strip=True) if updated else None,
        'source':url,
    }
    # Preserve source view/date labels without replaying production view-write requests.
    meta=article.select_one('header div[class$="__views"]')
    item['meta']=meta.get_text(' ',strip=True) if meta else ''
    pages.append(item)
pages.sort(key=lambda p:p['path'])
dump(content/'pages.json',pages)
dump(content/'assets.json',asset_map)

# Font declarations contain their original unicode ranges and weights, no remote fonts.
fonts=[]
for f in (source/'bukago.app/_next/static/chunks').glob('*.css'):
    for face in re.findall(r'@font-face\{[^}]+\}',f.read_text()):
        if 'Fallback' in face:continue
        face=re.sub(r'\.\./media/([^\)]+)',r'/assets/site/_next/static/media/\1',face)
        if face not in fonts:fonts.append(face)
(root/'src/styles').mkdir(parents=True,exist_ok=True)
(root/'src/styles/fonts.css').write_text('\n'.join(fonts)+'\n')
summary={'source':'https://bukago.app/','captured':'2026-10-01','originalStack':'Next.js 16.3.3 / React / SCSS modules',
 'locales':list(locales),'articles':sum(p['kind']=='article' for p in pages),
 'legalPages':sum(p['kind']=='legal' for p in pages),'assets':len(set(asset_map.values())),
 'unavailable':{u:e for u,e in json.loads((source/'errors.json').read_text()).items() if '/_next/' not in u}}
dump(content/'migration.json',summary)
print(json.dumps(summary,ensure_ascii=False,indent=2))
