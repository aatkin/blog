import { ContentNode, ContentType } from "../ContentNode";
import { ValidationException } from "../../exceptions/ValidationException";

export interface TextNodeContent {
  value: string;
}

export abstract class TextNode {
  public static validate(node: ContentNode): boolean {
    this.validateNode(node);
    this.validateContent(node.content);
    return true;
  }

  public static mapContent(node: ContentNode): TextNodeContent {
    return {
      value: node.content.value
    };
  }

  private static validateNode(node: ContentNode): boolean {
    if (node.childNodes.length > 0) {
      throw new ValidationException("Text cannot have child nodes");
    }
    if (node.parentNode.contentType === ContentType.Text) {
      throw new ValidationException("Text cannot have text as parent node");
    }

    return true;
  }

  private static validateContent(content: any): boolean {
    if (typeof content.value !== "string") {
      throw new ValidationException("Text content value must be a string");
    }

    return true;
  }
}
