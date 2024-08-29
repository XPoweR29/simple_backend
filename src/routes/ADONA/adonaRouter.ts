import { Request, Response, Router } from "express";
import { AdonaController } from "../../controllers/adona.controller";

export const adonaRouter = Router();
const adonaController = new AdonaController();

adonaRouter
//group routes
.get('/', adonaController.getMenu.bind(adonaController))
.get('/group/:id', adonaController.getGroup.bind(adonaController))
.get('/group', adonaController.getGroupByName.bind(adonaController))
.post('/group', adonaController.createNewGroup.bind(adonaController))
.patch('/group/:id', adonaController.editGroup.bind(adonaController))
.delete('/group/:id', adonaController.removeGroup.bind(adonaController))

//dish routes
.get('/dish', adonaController.getDishByName.bind(adonaController))
.get('/dish/:id', adonaController.getDish.bind(adonaController))
.post('/dish/', adonaController.createNewDish.bind(adonaController))
.patch('/dish/:id', adonaController.editDish.bind(adonaController))
.delete('/dish/:id', adonaController.removeDish.bind(adonaController))
