namespace app {
export class Net {
    IsConnected: boolean;
    websocket: WebSocket;
    router: Map<string, Function>;
    constructor() {
        this.router = new Map<string, Function>();
        this.connect();
    }
    connect() {
        let that = this
        this.IsConnected = false;
        this.websocket = new WebSocket("ws://localhost:10001/");
        this.websocket.onopen = (event) => {
            that.IsConnected = true;
            console.log('WebSocket is connected');
        }
        this.websocket.onmessage = (event) => {
            console.log("onmessage", event)
            //event.data layout cmd(uint32),body(blob)
            if (event.data instanceof Blob) {
                let reader = new FileReader();
                reader.onload = function () {
                    let arrayBuffer = reader.result as ArrayBuffer;
                    that.processArrayBuffer(arrayBuffer);
                }
                reader.readAsArrayBuffer(event.data);
            } else if (event.data instanceof Uint8Array) {
                that.processArrayBuffer(event.data.buffer);
            }
        }
        this.websocket.onclose = (event) => {
            that.IsConnected = false;
            console.log('WebSocket onclose');
            GUI_Tips.ShowStr("网络链接已断开", function () {
                GameUI.hideAll();
                GameUI.show(1);
                that.connect();
            })
        }
    }
    processArrayBuffer(buffer: ArrayBuffer) {
        /*
        let dv = new DataView(buffer);
        let cmdNum = dv.getUint32(0, true);
        let body = new Uint8Array(buffer, 4);
        let cmd = gateway.decodeCMD[cmdNum];
        let decoder = gateway.decoder[cmd];
        let obj = decoder(body);
        let func = this.router.get(cmd);
        console.log('WebSocket message', cmd, JSON.stringify(obj))
        if (func != undefined) {
            func(obj);
        }
        */
        let str = new TextDecoder().decode(buffer);
        console.log('WebSocket message', str)
        let obj = JSON.parse(str);
        let cmd = obj.cmd;
        let func = this.router.get(cmd);
        if (func != undefined) {
            func(obj.body);
        }
    }
    factory<T>(ctor: { new (): T }): T {
        return new ctor();
    }

    on(cmd: string,  func: (arg: any) => void): void {
        this.router.set(cmd, func);
    }

    send(cmd: string, body: any) {
        if (!this.IsConnected) {
            console.error('WebSocket is not connected', cmd, JSON.stringify(body));
            return;
        }
        let obj = { cmd: cmd, body: body };
        let msg = JSON.stringify(obj);
        console.log('WebSocket send', msg);
        this.websocket.send(msg);
    }
}
}