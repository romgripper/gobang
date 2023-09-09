import Cookies from "universal-cookie";
import Constant from "./Constant";

export default class PersistUtil {
    static getUsername() {
        return new Cookies().get(Constant.COOKIE_USERNAME);
    }

    static persistUsername(username) {
        new Cookies().set(Constant.COOKIE_USERNAME, username);
    }

    static removeUsername() {
        new Cookies().remove(Constant.COOKIE_USERNAME);
    }

    static getRival() {
        return new Cookies().get(Constant.COOKIE_RIVAL);
    }

    static persistRival(rival) {
        new Cookies().set(Constant.COOKIE_RIVAL, rival);
    }
}
