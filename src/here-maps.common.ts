import { View, Observable } from 'tns-core-modules/ui/core/view';
import { Property } from "tns-core-modules/ui/core/properties";

declare const android, com: any;

export interface HereOnGestureListener {
    onPanStart?: () => void;
    onPanEnd?: () => void;
    onMultiFingerManipulationStart?: () => void;
    onMultiFingerManipulationEnd?: () => void;
    onMapObjectsSelected?: (objects: any[]) => boolean;
    onTapEvent?: (p: android.graphics.PointF) => boolean;
    onDoubleTapEvent?: (p: android.graphics.PointF) => boolean;
    onPinchLocked?: () => void;
    onPinchZoomEvent?: (scaleFactor: number, p: android.graphics.PointF) => boolean;
    onRotateLocked?: () => void;
    onRotateEvent?: (rotateAngle: number) => boolean;
    onTiltEvent?: (angle: number) => boolean;
    onLongPressEvent?: (p: android.graphics.PointF) => boolean;
    onLongPressRelease?: () => void;
    onTwoFingerTapEvent?: (p: android.graphics.PointF) => boolean;
}

function onMapPropertyChanged(mapView: HereMapsBase) {
    mapView.updatePosition();
}

export abstract class HereMapsBase extends View {
    protected _map: any;
    public latitude: number;
    public longitude: number;
    public zoom: number;

    public static mapReadyEvent: string = 'mapReady';

    public static panStartEvent: string = 'panStart';
    public static panEndEvent: string = 'panEnd';
    public static multiFingerManipulationStartEvent: string = 'multiFingerManipulationStart';
    public static multiFingerManipulationEndEvent: string = 'multiFingerManipulationEnd';
    public static mapObjectsSelectedEvent: string = 'mapObjectsSelected';
    public static tapEvent: string = 'tap';
    public static doubleTapEvent: string = 'doubleTap';
    public static pinchLockedEvent: string = 'pinchLocked';
    public static pinchZoomEvent: string = 'pinchZoom';
    public static rotateLockedEvent: string = 'rotateLocked';
    public static rotateEvent: string = 'rotate';
    public static tiltEvent: string = 'tilt';
    public static longPressEvent: string = 'longPress';
    public static longPressReleaseEvent: string = 'longPressRelease';
    public static twoFingerTapEvent: string = 'twoFingerTap';

    public abstract updatePosition(): void;

    public notifyEvent(eventName: string) {
        this.notify({ eventName, object: this, map: this._map });
    }

    public notifyMapReady() {
        this.notifyEvent(HereMapsBase.mapReadyEvent);
    }
}

export const latitudeProperty = new Property<HereMapsBase, number>({ name: 'latitude', defaultValue: 0, valueChanged: onMapPropertyChanged });
latitudeProperty.register(HereMapsBase);

export const longitudeProperty = new Property<HereMapsBase, number>({ name: 'longitude', defaultValue: 0, valueChanged: onMapPropertyChanged });
longitudeProperty.register(HereMapsBase);

export const zoomProperty = new Property<HereMapsBase, number>({ name: 'zoom', defaultValue: 0, valueChanged: onMapPropertyChanged });
zoomProperty.register(HereMapsBase);
