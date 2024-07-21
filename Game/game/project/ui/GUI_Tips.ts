/**
 * 读档界面
 * Created by 黑暗之神KDS on 2020-09-15 12:22:43.
 */
interface tips {
    str: string
    fn: Function
}

class GUI_Tips extends GUI_16 {
    static tipsQueue: tips[] = []

    constructor() {
        super();
    }

    static showStr(str: string, fn: Function) {
        GUI_Tips.tipsQueue.push({ str, fn });
        console.log("ErrorTops code:", str, GUI_Tips.tipsQueue.length);
        // 如果队列为空，则立即显示消息
        if (GUI_Tips.tipsQueue.length === 1) {
            GUI_Tips.showNextTip();
        }
    }

    static showNextTip() {
        console.log("showNextTips", GUI_Tips.tipsQueue)
        if (!GUI_Tips.tipsQueue ||GUI_Tips.tipsQueue.length === 0)
            return;

        const { str, fn } = GUI_Tips.tipsQueue[0];
        let ui = GameUI.load(16) as GUI_Tips;
        ui.msg.text = str;
        Game.layer.uiLayer.addChild(ui);
        let that = GUI_Tips
        setTimeout(() => {
            that.tipsQueue.shift()
            ui.removeSelf();
            if (fn) {
                fn();
            }
            console.log("over left", that.tipsQueue.length)
            setTimeout(that.showNextTip, 300)
        }, 800);
    }

    static ShowStr(str: string, fn: Function) {
        GUI_Tips.showStr(str, fn);
    }

    static Show(code: number, fn: Function) {
        GUI_Tips.ShowStr("Error code:" + code, fn);
    }
}