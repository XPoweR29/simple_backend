import { Request, Response } from "express";
import { AdonaService } from "../services/adona.service";
import { validateDTO } from "../utils/validateDTO";
import { CreatGroupDTO, CreateDishDTO, GetDishByNameDTO, UpdateDishDTO, UpdateGroupOrderDTO } from "../DTO/adona.tdo";

export class AdonaController {
	private adonaService: AdonaService;
	constructor() {
		this.adonaService = new AdonaService();
	}

	async getMenu(req: Request, res: Response): Promise<void> {
		res.json(await this.adonaService.getMenu());
	}

	async createNewGroup(req: Request, res: Response): Promise<void> {
		const validData = await validateDTO(CreatGroupDTO, req.body);
		const newGroup = await this.adonaService.addNewGroup(validData.name);
		res.status(201).json({
			message: `Grupa "${newGroup.name}" została utowrzona`,
			data: newGroup,
		});
	}

	async getGroup(req: Request, res: Response): Promise<void> {
		res.json(await this.adonaService.getOneGroup(req.params.id));
	}

	async getGroupByName(req: Request, res: Response): Promise<void> {
		const validData = await validateDTO(CreatGroupDTO, req.body);
		res.json(await this.adonaService.getGroupByName(validData.name));
	}

	async editGroup(req: Request, res: Response): Promise<void> {
		const validData = await validateDTO(CreatGroupDTO, req.body);
		const updatedGroup = await this.adonaService.updateGroup(
			req.params.id,
			validData
		);
		res.json({
			message: `Nazwa grupy została zaktualizowana`,
			data: updatedGroup,
		});
	}

	async removeGroup(req: Request, res: Response): Promise<void> {
		const removedGroup = await this.adonaService.deleteGroup(req.params.id);
        res.json({message: `Grupa "${removedGroup.name}" została usunięta`});
	}

	async updateGroupOrder(req: Request, res: Response): Promise<void> {
		const groupsWithIndex = req.body;
		try{
			for(const index of groupsWithIndex){
				await validateDTO(UpdateGroupOrderDTO, index);
			};
			await this.adonaService.updateGroupOrder(groupsWithIndex);
			res.json({message: "Grupy zostały poprawnie zindeksowane"});
		} catch(err) {
			res.status(400).json({message: "Błąd podczas indeksowania grup"});
		}
	}

	//dish controller
	async getDish(req: Request, res: Response): Promise<void> {
		res.json(await this.adonaService.getOneDish(req.params.id));
	}

	async getDishByName(req: Request, res: Response): Promise<void> {
		const validData = await validateDTO(GetDishByNameDTO, req.body);
		res.json(await this.adonaService.getDishByName(validData.name));
	}

	async createNewDish(req: Request, res: Response): Promise<void> {
		const validData = await validateDTO(CreateDishDTO, req.body);
		const newDish = await this.adonaService.addNewDish(validData);
		res.status(201).json({
			message: `Danie "${newDish.name}" zostało dodane`,
			data: newDish,
		});
	}

	async editDish(req: Request, res: Response): Promise<void> {
        const validData = await validateDTO(UpdateDishDTO, req.body);
        const updatedDish = await this.adonaService.updateDish(req.params.id, validData);
        res.json({
            message: `Danie "${updatedDish.name}" zostało zaktualizowane`,
            data: updatedDish
        });
    }

    async removeDish(req: Request, res: Response): Promise<void> {
        const removedDish = await this.adonaService.deleteDish(req.params.id);
        res.json({message: `Danie "${removedDish.name}" zostało usunięte`});
    }
}
