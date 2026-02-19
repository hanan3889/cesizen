import AuthController from './AuthController'
import PageInformationController from './PageInformationController'
import CategorieInformationController from './CategorieInformationController'
import EvenementVieController from './EvenementVieController'
import DiagnosticStressController from './DiagnosticStressController'
import HistoriqueDiagnosticController from './HistoriqueDiagnosticController'
import UserController from './UserController'
import V1 from './V1'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
PageInformationController: Object.assign(PageInformationController, PageInformationController),
CategorieInformationController: Object.assign(CategorieInformationController, CategorieInformationController),
EvenementVieController: Object.assign(EvenementVieController, EvenementVieController),
DiagnosticStressController: Object.assign(DiagnosticStressController, DiagnosticStressController),
HistoriqueDiagnosticController: Object.assign(HistoriqueDiagnosticController, HistoriqueDiagnosticController),
UserController: Object.assign(UserController, UserController),
V1: Object.assign(V1, V1),
}

export default Api