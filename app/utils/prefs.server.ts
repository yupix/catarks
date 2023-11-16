/**
 * クライアントの設定用Cookie
 */
import * as cookie from 'cookie'

const cookieName = 'isOpenReportModal'

export function getIsOpenReportModal(request: Request) {
	const cookieHeader = request.headers.get('cookie')
	const parsed = cookieHeader === 'true' ? true : false

	return parsed
}

export function setIsOpenReportModal(status: boolean) {
	return cookie.serialize(cookieName, status ? 'true' : 'false', {
		path: '/',
		maxAge: -1,
	})
}
