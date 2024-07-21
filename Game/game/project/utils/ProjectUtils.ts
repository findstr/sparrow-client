/**
 * 项目层工具类
 * Created by 黑暗之神KDS on 2020-09-13 22:48:37.
 */
class ProjectUtils {
    // 最近的鼠标滚动值
    static mouseWhileValue: number = 0;
    /**
     * 回调函数辅助者：重用实例
     */
    static callbackHelper: Callback = new Callback;
    /**
     * 点辅助者：重用实例
     */
    static pointHelper: Point = new Point;
    /**
     * 矩形辅助者：重用实例
     */
    static rectangleHelper: Rectangle = new Rectangle;
    /**
     * 当前按键的事件对象
     */
    static keyboardEvent: EventObject;
    static keyboardEvents: { keyCode: number }[] = [];
    /**
     * 最近的操控方式 0-鼠标 1-按键 2-手柄
     */
    static lastControl: number = 0;
    /**
     * 当前按键来自手柄
     */
    static fromGamePad: boolean;
    /**
     * 矩形对象池
     */
    private static rectanglePool: PoolUtils = new PoolUtils(Rectangle);
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    static init() {
        // 鼠标滚动值
        stage.on(EventObject.MOUSE_WHEEL, this, (e: EventObject) => { ProjectUtils.mouseWhileValue = e.delta; });
        // 鼠标移动
        stage.on(EventObject.MOUSE_MOVE, this, (e: EventObject) => { ProjectUtils.lastControl = 0; });
        // 注册键盘点击事件
        stage.on(EventObject.KEY_DOWN, this, (e: EventObject) => { ProjectUtils.lastControl = ProjectUtils.fromGamePad ? 2 : 1; ProjectUtils.fromGamePad = false; this.keyboardEvent = e; if (ArrayUtils.matchAttributes(this.keyboardEvents, { keyCode: e.keyCode }, true).length == 0) { this.keyboardEvents.push({ keyCode: e.keyCode } as any); } });
        // 注册键盘弹起事件
        stage.on(EventObject.KEY_UP, this, (e: EventObject) => { ArrayUtils.remove(this.keyboardEvents, ArrayUtils.matchAttributes(this.keyboardEvents, { keyCode: e.keyCode }, true)[0]); this.keyboardEvent = null; });
    }
    //------------------------------------------------------------------------------------------------------
    // Rectangle
    //------------------------------------------------------------------------------------------------------
    /**
     * 创建Rectangle
     */
    static takeoutRect(): Rectangle {
        return ProjectUtils.rectanglePool.takeout();
    }
    /**
     * 返还Rectangle
     * @param rect 
     */
    static freeRect(rect: Rectangle): void {
        ProjectUtils.rectanglePool.free(rect);
    }
    //------------------------------------------------------------------------------------------------------
    // 时间
    //------------------------------------------------------------------------------------------------------
    /**
     * 格式化日期
     * @param fmt 格式化字符串规格 如    
     * @param date 
     * @return [String] 
     */
    static dateFormat(fmt: string, date: Date): string {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
    /**
     * 格式化计时器
     * @param time 时间段（毫秒）
     * @return [string] 
     */
    static timerFormat(time: number): string {
        let S = 1000;
        let M = S * 60;
        let H = M * 60;
        let hTotal = Math.floor(time / H);
        let hStr = MathUtils.fixIntDigit(hTotal, 2);
        time -= H * hTotal;
        let mTotal = Math.floor(time / M);
        let mStr = MathUtils.fixIntDigit(mTotal, 2);
        time -= M * mTotal;
        let sTotal = Math.floor(time / S);
        let sStr = MathUtils.fixIntDigit(sTotal, 2);
        return hStr + ":" + mStr + ":" + sStr;
    }

    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 元素组索引移动
     * 根据相对的方位和距离计算
     * @param groupElements 元素组信息
     * @param currentIndex 索引
     * @param moveDir 2=下 4=左 6=右 8=上
     * @param fuzzySearch [可选] 默认值=false 模糊搜索，如果启用则在相对方位还会搜索临近的两个方向
     */
    static groupElementsMoveIndex(groupElements: { x: number, y: number }[], currentIndex: number, moveDir: number, limitSecondAxis: number = 50): number {
        let currentElement = currentIndex == -1 ? { x: 0, y: 0 } : groupElements[currentIndex];
        // 对应移动方向允许的方位
        let allowOris: number[] = {
            2: [1, 2, 3], // 下方向
            4: [1, 4, 7], // 左方向
            6: [3, 6, 9], // 右方向
            8: [7, 8, 9]  // 上方向
        }[moveDir];
        if (!allowOris) return null;
        // 获取第二轴参考
        let secondAxisName: string = (moveDir == 4 || moveDir == 6) ? "y" : "x";
        // 遍历所有节点
        let minDis = Number.MAX_VALUE;
        let minIndex: number = null;
        for (let i = 0; i < groupElements.length; i++) {
            let targetEle = groupElements[i];
            if (i == currentIndex) continue;
            let angle = MathUtils.direction360(currentElement.x, currentElement.y, targetEle.x, targetEle.y);
            let ori = GameUtils.getOriByAngle(angle);
            // -- 去除方位不对的节点
            if (allowOris.indexOf(ori) == -1) continue;
            // -- 获取第二轴的距离
            let secondAxisDistance = Math.abs(targetEle[secondAxisName] - currentElement[secondAxisName]);
            if (secondAxisDistance > limitSecondAxis) continue;
            // -- 获取最短的距离
            let dis2 = Point.distanceSquare2(currentElement.x, currentElement.y, targetEle.x, targetEle.y);
            if (dis2 < minDis) {
                minDis = dis2;
                minIndex = i;
            }
        }
        return minIndex;
    }

}