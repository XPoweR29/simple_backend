
import { Request, Response, Router } from "express";
import { MenuService } from "../../services/ADONA/menu.service";

export const adonaRouter = Router();

adonaRouter

.delete('/:id', async (req: Request, res: Response) => {
    const adonaService = new MenuService();
    res.json(await adonaService.deleteGroup(req.params.id));
});