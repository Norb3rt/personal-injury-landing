import { google } from 'googleapis'
import { JWT } from 'google-auth-library'
import { StateDataLoader } from '../lib/data/state-loader'
import * as fs from 'fs'
import * as path from 'path'

// NOTE: You need to install googleapis: npm install googleapis
// AND place your service account JSON key in: secrets/service_account.json

const KEY_FILE = path.join(process.cwd(), 'secrets', 'service_account.json')

async function main() {
    if (!fs.existsSync(KEY_FILE)) {
        console.error(`❌ Service account key not found at ${KEY_FILE}`)
        console.log('Please create a service account in Google Cloud Console, enable Indexing API, and download the JSON key.')
        return
    }

    const auth = new JWT({
        keyFile: KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    })

    const indexing = google.indexing({ version: 'v3', auth })

    // Get all URLs to index
    // For now, let's just get the first 50 cities to avoid hitting quotas immediately
    const allLocations = await StateDataLoader.getAllProcessedLocations()
    const urlsToIndex = allLocations.slice(0, 50).map(
        loc => `https://personalinjury.lawproactive.com/personal-injury-lawyer/${loc.stateSlug}/${loc.citySlug}`
    )

    console.log(`🚀 Starting indexing for ${urlsToIndex.length} URLs...`)

    for (const url of urlsToIndex) {
        try {
            const res = await indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: 'URL_UPDATED',
                },
            })
            console.log(`✅ Indexed: ${url} [${res.status}]`)
        } catch (error: any) {
            console.error(`❌ Failed: ${url} - ${error.message}`)
        }
    }
}

main().catch(console.error)
