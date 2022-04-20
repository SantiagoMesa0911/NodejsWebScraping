const cheerio = require('cheerio');
const request = require('request-promise')
const fs = require('fs-extra')

const writeStream = fs.createWriteStream('quotes.csv')


async function init() {
	const $ = await request({
		uri: 'http://quotes.toscrape.com/',
		transform: body => cheerio.load(body)
	})

	writeStream.write('Quote|Author|Tags\n')
	$('.quote').each((i, elemento) => {
		const text = $(elemento).find('span.text').text().replace(/(^\“|\”$)/g, "")
		const author = $(elemento).find('span small.author').text()
		const tags = []
		$(elemento).find('.tags a.tag').each((i, elemento) => tags.push($(elemento).text()))
		writeStream.write(`${text}|${author}|${tags}\n`);
	})
}
init()