/**
 * 存档界面
 * Created by 黑暗之神KDS on 2020-09-15 14:01:31.
 */
class GUI_ServerItem extends ListItem_1021 {
    serverDesc: any;
    constructor(server : any) {
        super();
        this.serverDesc = server;
        this.server = server.name;
        this.createTime = server.opentime
    }
}