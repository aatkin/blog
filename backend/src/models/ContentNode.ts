import { UnknownContentNodeException } from "../exceptions/UnknownContentNodeException";
import { ValidationException } from "../exceptions/ValidationException";
import { ContainerNode, ContainerNodeContent } from "./ContentTypes/ContainerNode";
import { ImageNode, ImageNodeContent } from "./ContentTypes/ImageNode";
import { LinkNode, LinkNodeContent } from "./ContentTypes/LinkNode";
import { TextNode, TextNodeContent } from "./ContentTypes/TextNode";


export class ContentNode
{
    public contentType: ContentType;
    public content: any;
    public parentNode: ContentNode;
    public childNodes: ContentNode[];

    constructor(contentType: ContentType, content: any, parentNode: ContentNode, childNodes: ContentNode[])
    {
        this.contentType = contentType;
        this.content = content;
        this.parentNode = parentNode;
        this.childNodes = childNodes;

        // validate node and content
        ContentType.validate(this);
        // map values from incoming data (maybe unnecessary?)
        this.content = ContentType.mapContent(this);
    }
}

export enum ContentType {
    Text = "text",
    Image = "image",
    Link = "link",
    Container = "container"
}

export namespace ContentType
{
    export function validate(node: ContentNode): boolean
    {
        if (node.content == null)
        {
            throw new ValidationException("Node content cannot be null");
        }

        switch (node.contentType)
        {
            case ContentType.Text:
                return TextNode.validate(node);
            case ContentType.Image:
                return ImageNode.validate(node);
            case ContentType.Link:
                return LinkNode.validate(node);
            case ContentType.Container:
                return ContainerNode.validate(node);
            default:
                throw new UnknownContentNodeException(node.contentType);
        }
    }

    export function mapContent(node: ContentNode): ContainerNodeContent | ImageNodeContent | LinkNodeContent | TextNodeContent
    {
        switch (node.contentType)
        {
            case ContentType.Text:
                return TextNode.mapContent(node);
            case ContentType.Image:
                return ImageNode.mapContent(node);
            case ContentType.Link:
                return LinkNode.mapContent(node);
            case ContentType.Container:
                return ContainerNode.mapContent(node);
            default:
                throw new UnknownContentNodeException(node.contentType);
        }
    }
}

