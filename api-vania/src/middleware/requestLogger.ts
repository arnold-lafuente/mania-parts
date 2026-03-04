import { Request, Response, NextFunction } from "express"

/**
 * Logs every request to the console: method, URL, status code and duration.
 * For 4xx/5xx responses, logs as error with the status.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()
    const method = req.method
    const url = req.originalUrl || req.url

    res.on("finish", () => {
        const status = res.statusCode
        const duration = Date.now() - start
        const line = `${method} ${url} ${status} ${duration}ms`

        if (status >= 500) {
            console.error(`[ERROR] ${line}`)
        } else if (status >= 400) {
            console.warn(`[WARN] ${line}`)
        } else {
            console.log(line)
        }
    })

    next()
}
