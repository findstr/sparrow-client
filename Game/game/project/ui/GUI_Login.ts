/**
 * 读档界面
 * Created by 黑暗之神KDS on 2020-09-15 12:22:43.
 */
class GUI_Login extends GUI_15 {
    /**
     * 构造函数
     */
    private loginClick(type: string, data?: any): boolean {
        let server_id = app.module.ServerList.selectedServer.id
        Game.net.send("login_r", { server_id: server_id })
        return true
    }
    
    private refreshServer() {
        console.log("refreshServer")
        if (!app.module.ServerList.selectedServer) {
            this.BtnServer.label = "";
            return
        }
        this.BtnServer.label = app.module.ServerList.selectedServer.name
    }

    private showServerList() {
        GUI_ServerList.Show(() => {
            this.refreshServer()
        })
    }

    private static enterScene() {
        GameUI.hideAll()
        // 当监听到需要进入到新的主场景后执行：
        ClientScene.createScene(1, Callback.New((scene:ClientScene)=>{
            // 记录当前的场景
            Game.currentScene = scene as ProjectClientScene;
            // 添加到指定层级上（游戏总层级参考 GameLayer）
            Game.layer.sceneLayer.addChild(scene.displayObject);
            // 场景开始渲染（如果不开始渲染则场景处于静止状态）
            Game.currentScene.startRender();

            Game.currentScene.camera.sceneObject = null;
            // 再设置指定的位置
            Game.currentScene.camera.viewPort.x = 1039;
            Game.currentScene.camera.viewPort.y = 1029;
            Game.currentScene.camera.scaleX = 0.1;
            Game.currentScene.camera.scaleY = 0.1;
        }, this), null, true);
    }

    private login_a(ack: any) {
        if (ack.code != undefined) {
            console.log("login_a", ack.code)
            GUI_Tips.Show(ack.code, null)
            let server_id = app.module.ServerList.selectedServer.id
            let name = "XXX"
            Game.net.send("create_r", { server_id: server_id, name: name })
            return
        }
        GUI_Login.enterScene()
    }

    private create_a(ack: any) {
        if (ack.code != undefined) {
            GUI_Tips.Show(ack.code, null)
            console.error("create_a:", ack.code)
            return
        }
        GUI_Login.enterScene()
    }

    constructor() {
        super();
        this.refreshServer()
        // 监听事件：当界面显示时
        this.BtnServer.on("mousedown", this, this.showServerList, null) 
        this.BtnLogin.on("mousedown", this, this.loginClick, null)
        Game.net.on("login_a", this.login_a)
        Game.net.on("create_a", this.create_a)
    }

    static Show() {
        let ui = GameUI.load(15) as GUI_ServerList;
        Game.layer.uiLayer.addChild(ui);
    }
}