import {action, autorun, observable} from "mobx";
import { GuildInfo_guild, Message_thread, Settings_settings } from "@generated";
import {ICategory} from "@ui/Sidebar/Channels/categorise";

export class GeneralStore {
  @observable appName = 'WidgetBot';

  @observable needsUpdate: boolean = false;
  @observable loading?: boolean;
  @observable fetchGuild?: Function;
  @observable guild?: GuildInfo_guild;
  @observable settings?: Settings_settings;
  @observable channels: ICategory[] = [];
  @observable menuOpen: boolean = false;
  @observable activeThread?: Omit<Message_thread, '__typename'>;

  constructor() {
    autorun(() => {
      if (this.needsUpdate) {
        this.fetchGuild?.();
        this.needsUpdate = false;
      }
    })
  }

  @action toggleMenu(res: boolean = this.menuOpen) {
    this.menuOpen = res
  }

  @action setGuild(guild: GuildInfo_guild) {
    this.guild = guild
  }

  @action setSettings(settings: Settings_settings) {
    this.settings = settings
  }

  @action setChannels(channels: ICategory[]) {
    this.channels = channels
  }

  @action setActiveThread(data?: Omit<Message_thread, '__typename'>) {
    this.activeThread = data;
  }
}

// export default new GeneralStore();
export const generalStore = new GeneralStore();
