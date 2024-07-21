/**
 * 存档界面
 * Created by 黑暗之神KDS on 2020-09-15 14:01:31.
 */
class GUI_ServerList extends GUI_14 {
    closeFn: Function;
    constructor() {
        super();
        if (!this.list) {
                return;
        }
        GUI_Manager.standardList(this.list);
        UIList.focus = this.list;
        this.list.on(UIList.ITEM_CLICK, this, this.onServerItemClick);
        let items = [];
        for (var i = 0; i < app.module.ServerList.servers.length; i++) {
            var server = app.module.ServerList.servers[i];
            var item = new GUI_ServerItem(server);
            items.push(item);
        }
        this.list.items = items;
    }
    onServerItemClick() {
        var item = this.list.selectedItem as GUI_ServerItem;
        app.module.ServerList.selectedServer = item.serverDesc;
        GameUI.hide(14);
        if (this.closeFn) 
            this.closeFn()
    }
    static Show(cb: Function) {
        let ui = GameUI.load(14) as GUI_ServerList;
        ui.closeFn = cb;
        Game.layer.uiLayer.addChild(ui);
   }
}