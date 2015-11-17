var pg = require('pg');
var fs = require('fs');
var libxmljs = require("libxmljs");
var escape = require("html-escape");

var article_file = "/Users/grant/devel/medix-nlp/crawled-articles-080415.xml"

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var seed = 4;

function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
	
	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;
	
	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;
		
		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}
	
	k1 = 0;
	
	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);
		
		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}
	
	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

var data = fs.readFileSync(article_file, {encoding: 'utf-8'})
var article_dict = {}
var xmlDoc = libxmljs.parseXml(data, { noblanks: true })
var children = xmlDoc.root().childNodes();
console.log(children.length)
for (var i = 0; i < children.length; i++) {
	//console.log(i);
	var gchildren = children[i].childNodes()
	for (var j = 0; j < gchildren.length; j++) {
		var name =  gchildren[j].name()
		if (name == 'url'){
			var url = gchildren[j].text()
			var id = murmurhash3_32_gc(gchildren[j].text(), seed)
		}
		if (name == 'title'){
			var title = gchildren[j].text()
		}
		if (name == 'domain'){
			var domain = gchildren[j].text()
		}
		if (name == 'text'){
			var text = gchildren[j].text()
		}
	}
	/*if (article_dict[url] != undefined){
		console.log('found duplicate', url)
	}*/
	article_dict[url] = {'id':id, 'title':title, 'domain':domain, 'url':url, 'content':escape(text)}
};

console.log(Object.keys(article_dict).length);



console.log(process.env.DATABASE_URL)
pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	console.log(client)
	if (err){
		console.error(err)
	}
	else if (typeof client !== null){
		Object.keys(article_dict).forEach(function(key){
			client.query("INSERT INTO article_texts (id, url, domain, title, content, annotated) VALUES($1, $2, $3, $4, $5, $6);", [article_dict[key]['id'], article_dict[key]['url'], article_dict[key]['domain'], article_dict[key]['title'], article_dict[key]['content'], 0], function(err2, result){
				if (err2) {
					console.error(err2);
				}
				 else {
					console.log(result);
				}
			});
		});
	}
	//done();
});


