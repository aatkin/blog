import { ContentNode, ContentType } from "../ContentNode";
import { ValidationException } from "../../exceptions/ValidationException";


export interface LinkNodeContent
{
    src?: string;
    pageGuid?: string;
    altText: string;
}

export abstract class LinkNode
{
    public static validate(node: ContentNode): boolean
    {
        this.validateNode(node);
        this.validateContent(node.content);
        return true;
    }

    public static mapContent(node: ContentNode): LinkNodeContent
    {
        return {
            src: node.content.src,
            pageGuid: node.content.pageGuid,
            altText: node.content.altText
        };
    }

    private static validateNode(node: ContentNode): boolean
    {
        return true;
    }

    private static validateContent(content: any): boolean
    {
        if (typeof content.href !== "string" && typeof content.pageGuid !== "string")
        {
            throw new ValidationException("Link must have href or guid of type string");
        }

        return true;
    }
}
