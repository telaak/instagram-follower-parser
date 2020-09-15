class InstagramParser {

    constructor(include_reel = true, fetch_mutual = true, first = 50) {
        this.variables =  {
            include_reel, fetch_mutual, first
        }
    }

    async init() {
        this.queryHash = await this.getQueryHash()
        this.variables.id = await this.getUserId()
    }

    async getUserId(username) {
        const json = await fetch (`https://www.instagram.com/${username}/?__a=1`).then(res => res.json())
        return json.graphql.user.id
    }

    async getQueryHash() {
        const script = await fetch(Array.from(document.getElementsByTagName('script')).find(n => n.src.includes('Consumer.js')).src).then(res => res.text())
        return script.match(/const t="[a-z0-9]{32}",n="/)[0].match(/[a-z0-9]{32}/)[0]
    }
    
    getVariables(after) {
        return encodeURI(JSON.stringify({...this.variables, after}))
    }

    async getFollowers(endCursor) {
        return fetch(`https://www.instagram.com/graphql/query/?query_hash=${this.queryHash}&variables=${this.getVariables(endCursor)}`).then(res => res.json())
    }

}

const instagramParser = new InstagramParser()

instagramParser.init().then(async () => {
    instagramParser.getFollowers('QVFEZFRIbHp0cnItX3hTQm0zYlZUdzhsMUc3WTRFYUlRdkIyZEh3aGNEUnJkNDdJY1QzVl9nbE8zLWVHazZEZXhUa1RMektNdC1lYnhHUjVBam0zMkpsbw==').then(console.log)
})
