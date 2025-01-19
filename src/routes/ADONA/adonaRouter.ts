import { Request, Response, Router } from "express";
import { AdonaController } from "../../controllers/adona.controller";
import { databaseInit } from "../../middlewares/databaseInit.middleware";

export const adonaRouter = Router();
const adonaController = new AdonaController();

adonaRouter.use(databaseInit);

adonaRouter
//group routes
.get('/', adonaController.getMenu.bind(adonaController))
.get('/group/:id', adonaController.getGroup.bind(adonaController))
.get('/group', adonaController.getGroupByName.bind(adonaController))
.post('/group', adonaController.createNewGroup.bind(adonaController))
.patch('/group/:id', adonaController.editGroup.bind(adonaController))
.patch('/group', adonaController.updateGroupOrder.bind(adonaController))
.delete('/group/:id', adonaController.removeGroup.bind(adonaController))

//dish routes
.get('/dish', adonaController.getDishByName.bind(adonaController))
.get('/dish/:id', adonaController.getDish.bind(adonaController))
.post('/dish/', adonaController.createNewDish.bind(adonaController))
.patch('/dish/:id', adonaController.editDish.bind(adonaController))
.delete('/dish/:id', adonaController.removeDish.bind(adonaController))
