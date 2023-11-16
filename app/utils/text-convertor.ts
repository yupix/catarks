export function katakanaToHiragana(text: string) {
	return text.replace(/[\u30a1-\u30f6]/g, function (match) {
		const chr = match.charCodeAt(0) - 0x60
		return String.fromCharCode(chr)
	})
}

export function hiraganaToKatagana(text: string) {
	return text.replace(/[\u3041-\u3096]/g, function (match) {
		const chr = match.charCodeAt(0) + 0x60
		return String.fromCharCode(chr)
	})
}

const roman = [
	{ value: 6, symbol: 'ⅵ' },
	{ value: 5, symbol: 'ⅴ' },
	{ value: 4, symbol: 'ⅳ' },
	{ value: 3, symbol: 'ⅲ' },
	{ value: 2, symbol: 'ⅱ' },
	{ value: 1, symbol: 'ⅰ' },
]

export function toRoman(num: number) {
	let result = ''
	for (let i = 0; i < roman.length; i++) {
		while (num >= roman[i].value) {
			result += roman[i].symbol
			num -= roman[i].value
		}
	}
	return result
}

export function replaceNumbersWithRoman(str: string) {
	const matches = str.match(/\d+/g)
	if (matches) {
		for (const num of matches) {
			const romanNum = toRoman(parseInt(num))
			str = str.replace(num, romanNum)
		}
	}
	return str
}

export function replaceFuzzyWord(text: string) {
	return hiraganaToKatagana(
		replaceNumbersWithRoman(text.replace('・', '').toLowerCase()),
	)
}
