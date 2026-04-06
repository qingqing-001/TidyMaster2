// Cocos Creator 3.8.6 简易类型定义
// 注意：完整定义由 Cocos Creator 编辑器自动生成，此文件用于离开发环境编译检查

declare module 'cc' {
  // 基础类型
  export type Vec2 = { x: number, y: number };
  export type Vec3 = { x: number, y: number, z: number };
  export type Color = { r: number, g: number, b: number, a: number };
  export type Size = { width: number, height: number };

  // // _decorator
  export const _decorator: {
    ccclass: (name: string) => ClassDecorator;
    property: any;
    executeInEditMode: ClassDecorator;
    menu: ClassDecorator;
    help: ClassDecorator;
    executionOrder: ClassDecorator;
    requireComponent: ClassDecorator;
    disallowMultiple: ClassDecorator;
  };

  // 装饰器
  export const ccclass: (name: string) => ClassDecorator;

  // property装饰器 - 支持多种调用方式
  export const property: any;

  export const executeInEditMode: ClassDecorator;
  export const menu: ClassDecorator;
  export const help: ClassDecorator;
  export const executionOrder: ClassDecorator;
  export const requireComponent: ClassDecorator;
  export const disallowMultiple: ClassDecorator;

  // Event 触摸事件
  export namespace Event {
    export class Event {
      type: string;
      bubbles: boolean;
      currentTarget: Node;
      target: Node;
      propagationStopped: boolean;
      stopPropagation(): void;
    }
  }

  // EventTouch 类型
  export class EventTouch extends Event.Event {
    getUILocation(): Vec2;
    getUIPreviousLocation(): Vec2;
    getLocation(): Vec2;
    getPreviousLocation(): Vec2;
    getDelta(): Vec2;
    getLocationX(): number;
    getLocationY(): number;
    getID(): number;
  }

  // Component 基类
  export abstract class Component {
    node: Node;
    readonly uuid: string;
    enabled: boolean;
    readonly enabledInHierarchy: boolean;

    onLoad?(): void;
    start?(): void;
    update?(dt: number): void;
    lateUpdate?(dt: number): void;
    onEnable?(): void;
    onDisable?(): void;
    onDestroy?(): void;
  }

  // Node 节点
  export class Node {
    name: string;
    parent: Node | null;
    children: Node[];
    active: boolean;
    position: Vec3;
    worldPosition: Vec3;
    scale: Vec3;
    rotation: any;

    static readonly EventType: {
      TOUCH_START: string;
      TOUCH_MOVE: string;
      TOUCH_END: string;
      TOUCH_CANCEL: string;
      MOUSE_DOWN: string;
      MOUSE_MOVE: string;
      MOUSE_UP: string;
      MOUSE_LEAVE: string;
      MOUSE_ENTER: string;
      MOUSE_WHEEL: string;
    };

    getParent(): Node | null;
    getChildByName(name: string): Node | null;
    getChildByPath(path: string): Node | null;
    addChild(child: Node): void;
    removeChild(child: Node): void;
    removeAllChildren(): void;
    setParent(parent: Node | null, keepWorldTransform?: boolean): void;
    getComponent<T extends Component>(type: Function): T | null;
    addComponent<T extends Component>(type: Function): T;
    destroy(): void;
    isValid: boolean;

    // 事件
    on(type: string, callback: Function, target?: any, useCapture?: boolean): void;
    off(type: string, callback?: Function, target?: any): void;
    once(type: string, callback: Function, target?: any): void;
    emit(type: string, ...args: any[]): void;
    targetOff(target: any): void;
  }

  // Sprite 组件
  export class Sprite extends Component {
    spriteFrame: SpriteFrame | null;
    color: Color;
    sizeMode: number;
    customSize: Size;
    static readonlySizeMode: any;
  }

  // SpriteFrame 资源
  export class SpriteFrame extends Asset {
    originalSize: Size;
    rect: any;
    insetTop: number;
    insetBottom: number;
    insetLeft: number;
    insetRight: number;
  }

  // Label 组件
  export class Label extends Component {
    string: string;
    font: any;
    fontSize: number;
    lineSpacing: number;
    horizontalAlign: number;
    verticalAlign: number;
    overflow: number;
  }

  // Button 组件
  export class Button extends Component {
    normalSprite: SpriteFrame | null;
    pressedSprite: SpriteFrame | null;
    hoverSprite: SpriteFrame | null;
    disabledSprite: SpriteFrame | null;
    target: Node | null;
    clickEvents: any[];
    onClick(callback: Function, target?: any): void;
  }

  // Camera 组件
  export class Camera extends Component {
    orthoHeight: number;
    zoomRatio: number;
  }

  // Widget 组件
  export class Widget extends Component {
    isAlignTop: boolean;
    isAlignBottom: boolean;
    isAlignLeft: boolean;
    isAlignRight: boolean;
    top: number;
    bottom: number;
    left: number;
    right: number;
    alignFlags: number;
  }

  // Canvas 组件
  export class Canvas extends Component {
    alignCanvasWithScreen: boolean;
    designResolution: Size;
    fitHeight: boolean;
    fitWidth: boolean;
  }

  // Asset 基类
  export class Asset {
    readonly name: string;
    readonly uuid: string;
    readonly native: string | null;
    readonly refCount: number;
    addRef(): void;
    decRef(): void;
    destroy(): void;
  }

  // AudioClip 资源
  export class AudioClip extends Asset {
    duration: number;
  }

  // director 全局单例
  export class director {
    static getScene(): Scene | null;
    static loadScene(name: string, onLaunched?: Function): void;
    static preloadScene(name: string, onLoaded?: Function): void;
  }

  // Scene 类
  export class Scene {
    name: string;
    readonly uuid: string;
  }

  // resources 模块
  export namespace resources {
    function load(path: string, type: Function, callback: (err: Error | null, asset: Asset) => void): void;
    function loadDir(path: string, type: Function, callback: (err: Error | null, assets: Asset[]) => void): void;
    function release(asset: Asset): void;
    function releaseDir(path: string, type: Function): void;
  }

  // assetManager 模块
  export namespace assetManager {
    function releaseAsset(asset: Asset): void;
  }

  // tween 缓动系统
  export function tween(target: any): any;
  export class Tween {
    to(to: any, duration?: number): Tween;
    by(to: any, duration?: number): Tween;
    start(): Tween;
    stop(): void;
    then(other: Tween): Tween;
    call(callback: Function): Tween;
    delay(duration: number): Tween;
    union(): Tween;
    target(target: any): Tween;
    repeat(count: number): Tween;
    repeatForever(): Tween;
    sequence(...tweens: Tween[]): Tween;
    parallel(...tweens: Tween[]): Tween;
    show(): void;
    hide(): void;
    removeSelf(): void;
    destroy(): void;
  }

  // easing 函数
  export namespace easing {
    function backOut(t: number): number;
    function backIn(t: number): number;
    function backInOut(t: number): number;
    function bounceOut(t: number): number;
    function bounceIn(t: number): number;
    function bounceInOut(t: number): number;
    function smooth(t: number): number;
    function smoothSine(t: number): number;
    function fade(t: number): number;
    function elasticOut(t: number): number;
    function elasticIn(t: number): number;
    function elasticInOut(t: number): number;
    function quadOut(t: number): number;
    function quadIn(t: number): number;
    function quadInOut(t: number): number;
    function cubicOut(t: number): number;
    function cubicIn(t: number): number;
    function cubicInOut(t: number): number;
    function quartOut(t: number): number;
    function quartIn(t: number): number;
    function quartInOut(t: number): number;
    function quintOut(t: number): number;
    function quintIn(t: number): number;
    function quintInOut(t: number): number;
    function sineOut(t: number): number;
    function sineIn(t: number): number;
    function sineInOut(t: number): number;
    function expoOut(t: number): number;
    function expoIn(t: number): number;
    function expoInOut(t: number): number;
    function circOut(t: number): number;
    function circIn(t: number): number;
    function circInOut(t: number): number;
    function linear(t: number): number;
  }

  // systemEvent 系统事件
  export class systemEvent {
    on(type: string, callback: Function, target?: any): void;
    off(type: string, callback?: Function, target?: any): void;
  }

  // v3 向量辅助
  export function v3(x?: number, y?: number, z?: number): Vec3;
  export function v2(x?: number, y?: number): Vec2;
  export function color(r?: number, g?: number, b?: number, a?: number) : Color;
  export function size(width?: number, height?: number): Size;

  // 键盘事件
  export class KeyCode {
    static readonly KEY_UP: number;
    static readonly KEY_DOWN: number;
    static readonly KEY_LEFT: number;
    static readonly KEY_RIGHT: number;
  }

  // 其他组件
  export class Transform extends Component {
    position: Vec3;
    rotation: any;
    scale: Vec3;
  }

  export class UITransform extends Component {
    contentSize: Size;
    anchorX: number;
    anchorY: number;
    priority: number;
  }

  export class Layout extends Component {
    type: number;
    resizeMode: number;
    spacingX: number;
    spacingY: number;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    horizontalDirection: number;
    verticalDirection: number;
  }

  export class ScrollView extends Component {
    content: Node;
    horizontal: boolean;
    vertical: boolean;
    elastic: boolean;
    inertia: boolean;
    brake: number;
  }

  export class EditBox extends Component {
    string: string;
    placeholder: string;
    maxLength: number;
    textHolder: any;
    background: Sprite;
  }

  export class Animation extends Component {
    play(name: string): void;
    stop(): void;
    pause(): void;
    resume(): void;
  }

  // ParticleSystem 粒子系统
  export class ParticleSystem extends Component {
    // 发射相关
    duration: number;
    emissionRate: number;
    emissionRateVar: number;
    totalParticles: number;

    // 生命周期
    life: number;
    lifeVar: number;

    // 颜色
    startColor: Color;
    startColorVar: Color;
    endColor: Color;
    endColorVar: Color;

    // 大小
    startSize: number;
    startSizeVar: number;
    endSize: number;
    endSizeVar: number;

    // 速度
    startSpeed: number;
    startSpeedVar: number;
    endSpeed: number;
    endSpeedVar: number;

    // 重力
    gravity: Vec3;
    gravityVar: Vec3;

    // 旋转
    startRotation: number;
    startRotationVar: number;
    endRotation: number;
    endRotationVar: number;

    // 位置
    positionType: number;
    posVar: Vec3;

    // 旋转
    rotatePerSecond: number;
    rotatePerSecondVar: number;

    // 方法
    resetSystem(): void;
    stopSystem(): void;
    pauseSystem(): void;
    resumeSystem(): void;
    addParticle(): void;
  }

  export class RigidBody2D extends Component {
    type: number;
    enabledContactListener: boolean;
    linearVelocity: Vec2;
    angularVelocity: number;
    fixedRotation: boolean;
    applyForce(force: Vec2, worldPoint?: Vec2): void;
    applyTorque(torque: number): void;
  }

  export class Collider2D extends Component {
    enabled: boolean;
    apply(): void;
  }

  // 引擎版本信息
  export const ENGINE_VERSION: string;

  // macro
  export const macro: any;

  // debug 调试模块
  export namespace debug {
    function log(...args: any[]): void;
    function warn(...args: any[]): void;
    function error(...args: any[]): void;
  }

  // math 数学工具
  export namespace math {
    function random(): number;
    function randomRange(min: number, max: number): number;
    function randomRangeInt(min: number, max: number): number;
    function lerp(a: number, b: number, t: number): number;
    function clampf(value: number, min: number, max: number): number;
    function toRadians(angle: number): number;
    function toDegrees(radian: number): number;
  }

  // scheduler 调度器
  export class scheduler {
    static schedule(callback: Function, target?: any, interval?: number, repeat?: number, delay?: number): void;
    static unschedule(callback: Function, target?: any): void;
    static unscheduleAllForTarget(target: any): void;
  }
}
