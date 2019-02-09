import { ContentNode, ContentType } from "../ContentNode";
import { ValidationException } from "../../exceptions/ValidationException";

export interface ContainerNodeContent {
  layout: "row" | "column";
}

export abstract class ContainerNode {
  public static validate(node: ContentNode): boolean {
    this.validateNode(node);
    this.validateContent(node.content);
    return true;
  }

  public static mapContent(node: ContentNode): ContainerNodeContent {
    return {
      layout: node.content.layout
    };
  }

  private static validateNode(node: ContentNode): boolean {
    if (node.parentNode.contentType === ContentType.Text) {
      throw new ValidationException("Container cannot have text as parent node");
    }

    return true;
  }

  private static validateContent(content: any): boolean {
    if (content.layout !== "row" && content.layout !== "column") {
      throw new ValidationException("Invalid container layout value");
    }

    return true;
  }
}
