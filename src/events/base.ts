import { Discord, On, ArgsOf } from 'discordx';

@Discord()
export abstract class BasicEvents {
  @On('ready')
  initialize(): void {
    console.log('Bot logged in.');
  }

  @On('messageCreate')
  recievedMessage([message]: ArgsOf<'message'>): void {
    console.log('Got message', message.content);
  }

  @On('messageDelete')
  messageDeleted([message]: ArgsOf<'messageDelete'>): void {
    console.log(`${message.id}:${message.content} was deleted.`);
  }

  @On('guildMemberAdd')
  memberJoin([member]: ArgsOf<'guildMemberAdd'>): void {
    console.log(
      `User : ${member.user.username} has joined the Discord Server.`
    );
  }

  @On('guildCreate')
  guildJoin([guild]: ArgsOf<'guildCreate'>): void {
    console.log(`Bot added to the Discord Server : ${guild.name}`);
  }
}

export default BasicEvents;
