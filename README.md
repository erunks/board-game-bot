# BoardGame Bot
This is a Discord bot to handle the managing of "Boardgame Library" sharing via a Google Sheet

It uses two main packages to do this:
  1. [`discordx`](https://github.com/oceanroleplay/discord.ts)
  2. [`google-spreadsheet`](https://github.com/theoephraim/node-google-spreadsheet)


## Setup
1. Clone the repo
2. Create you own `.env` file by doing: `cp .env.sample .env`
3. If you're using `nvm` do an `nvm install && nvm use` then run a `npm install`
4. Run `npm run dev` and it should start up

## FAQ
### How do I get values for my `.env` file?

<details>
  <summary> DISCORD_BOT_TOKEN </summary>

  1. Visit [the Discord developer portal](https://discord.com/developers/applications)
  2. Create a `New Application`
  3. Add a `Bot` to the app
  4. Copy the `Token` from the bot
</details>

<details>
  <summary> GOOGLE_PRIVATE_KEY && GOOGLE_SERVICE_ACCOUNT_EMAIL </summary>

  1. Begin by following this [guide to create a google cloud project](https://cloud.google.com/iam/docs/quickstart-client-libraries#create-project) through to `step 5.e`
  2. With the `JSON key`, the `GOOGLE_PRIVATE_KEY` should be set to the value of the `"private_key"`
  3. The `GOOGLE_SERVICE_ACCOUNT_EMAIL` should be set to the value of the `"client_email"`
</details>

<details>
  <summary> GOOGLE_SHEET_ID </summary>

  1. Visit [Google Sheets](https://sheets.google.com/)
  2. Create a `Blank Sheet`
  3. Set the header row to: `Game,	Player, Count,	Owner,	Location,	BGG Link`
  4. Copy the piece of the url that is inbetween `/spreadsheets/d/` and `/edit` (i.e. `https://docs.google.com/spreadsheets/d/<GOOGLE_SHEET_ID>/edit`).
</details>

<details>
  <summary> GUILD_IDS </summary>

  1. Go to the Discord Server you want to use
  2. Open the server settings
  3. Navigate to the `Widget` section
  4. Copy the `Server ID`

  If you have multiple servers you want to use, then simply add them all separated by commas (i.e. `GUILD_IDS="1234,5678,91011"`).
</details>

