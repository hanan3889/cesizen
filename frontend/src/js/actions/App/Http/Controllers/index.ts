import Auth from './Auth'
import Api from './Api'
import CategorieInformationController from './CategorieInformationController'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Api: Object.assign(Api, Api),
CategorieInformationController: Object.assign(CategorieInformationController, CategorieInformationController),
}

export default Controllers