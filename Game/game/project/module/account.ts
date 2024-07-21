namespace app {
export namespace module {
    export class Account {
        static account = "";
        static password = "";
        static storageKey = "cache.login";
        static loaded = false;
        static Load() {
            var dat = localStorage.getItem(Account.storageKey);
            if (dat != undefined) {
                var obj = JSON.parse(dat);
                Account.account = obj.account;
                Account.password = obj.password;
            }
        }
        static Save(a: string, p: string) {
            Account.account = a;
            Account.password = p;
            localStorage.setItem(Account.storageKey, JSON.stringify({
                account: a,
                password: p,
            }));
        }
    }
}}