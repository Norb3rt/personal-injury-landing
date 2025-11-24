import { StateDataLoader } from '../lib/data/state-loader'

async function test() {
    console.log('Testing StateDataLoader...')
    try {
        const states = await StateDataLoader.getAllStates()
        console.log('States found:', states)

        if (states.length > 0) {
            const firstState = states[0]
            console.log(`Loading data for ${firstState}...`)
            const cities = await StateDataLoader.loadStateData(firstState)
            console.log(`Loaded ${cities.length} cities for ${firstState}`)
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

test()
