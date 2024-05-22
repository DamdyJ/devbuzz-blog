import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import TagService from "../services/tag.service";
import { inject } from "inversify";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";

@controller("/tag")
export default class TagController {
    constructor(@inject(TagService) private readonly tagService: TagService) {}

    @httpGet("/")
    public async findAllTags(req: Request, res: Response) {
        try {
            const tags = await this.tagService.findAllTags();
            console.log(tags);
            return res.status(200).json(tags);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    @httpPost("/")
    public async createTag(req: Request, res: Response) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }

            const hasName = await this.tagService.findTagbyName(name);
            if (hasName) {
                return res
                    .status(HttpStatusCodeEnum.CONFLICT)
                    .json({ message: "Name already exsists" });
            }
            // Call the create method
            const tag = await this.tagService.create(name);

            // Return the created tag
            return res.status(201).json(tag);
        } catch (error) {
            console.error("Error creating tag:", error); // Log the error for debugging
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
