import { ContentNode, ContentType } from "src/models/ContentNode";
import { ValidationException } from "src/exceptions/ValidationException";

export interface ImageNodeContent {
  src: string;
  size: "small" | "medium" | "large";
}

export abstract class ImageNode {
  public static validate(node: ContentNode): boolean {
    this.validateNode(node);
    this.validateContent(node.content);
    return true;
  }

  public static mapContent(node: ContentNode): ImageNodeContent {
    return {
      src: node.content.src,
      size: node.content.size
    };
  }

  private static validateNode(node: ContentNode): boolean {
    if (node.childNodes.find(childNode => childNode.contentType === ContentType.Container)) {
      throw new ValidationException("Image cannot have container as child node");
    }

    return true;
  }

  private static validateContent(content: any): boolean {
    if (typeof content.src !== "string") {
      throw new ValidationException("Image must have src of type string");
    }
    if (content.size !== "small" && content.size !== "medium" && content.size !== "large") {
      throw new ValidationException("Invalid image size value");
    }

    return true;
  }
}
