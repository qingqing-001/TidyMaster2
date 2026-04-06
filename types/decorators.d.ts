// 装饰器类型定义补充

declare module 'cc' {
  export interface _decorator {
    ccclass: (name: string) => ClassDecorator;
    property: PropertyDecorator & {
      (): PropertyDecorator;
      (type: Function): PropertyDecorator;
      (type: Function[]): PropertyDecorator;
      (options: any): PropertyDecorator;
    };
    executeInEditMode: ClassDecorator;
    menu: ClassDecorator;
    help: ClassDecorator;
    executionOrder: ClassDecorator;
    requireComponent: ClassDecorator;
    disallowMultiple: ClassDecorator;
  }

  export const property: PropertyDecorator & {
    (): PropertyDecorator;
    (type: Function): PropertyDecorator;
    (type: Function[]): PropertyDecorator;
    (options: any): PropertyDecorator;
  };
}
