import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            message: 'Hello from Netlify Functions!',
            timestamp: new Date().toISOString(),
            path: event.path,
            method: event.httpMethod,
        }),
    }
}
