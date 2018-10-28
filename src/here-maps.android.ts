import { HereMapsBase } from './here-maps.common';

declare const android, com: any;

export class HereMaps extends HereMapsBase {
    private _mapFragment: any;
    private _pendingPositionUpdate: boolean;

    /**
     * Creates new native map.
     */
    public createNativeView(): Object {
        const nativeView = new android.widget.FrameLayout(this._context);
        const id = android.view.View.generateViewId();
        
        nativeView.setId(id);
        this.initMap(id);

        return nativeView;
    }

    private initMap(id: number): void {
        this._mapFragment = this.getMapFragment(id);

        if (this._mapFragment === null) return;

        this._mapFragment.init(this._context, 
            new com.here.android.mpa.common.OnEngineInitListener({
                onEngineInitializationCompleted: (error) => {
                    if (error === com.here.android.mpa.common.OnEngineInitListener.Error.NONE) {
                        // retrieve a reference of the map from the map fragment
                        const owner = new WeakRef(this).get();
                        owner._map = this._mapFragment.getMap();
                        owner.addGestureListeners();
                        owner.updatePosition();
                        owner.notifyMapReady();
                    } else {
                        android.widget.Toast.makeText(this._context,
                            `ERROR: Cannot initialize Map with error ${error}`,
                            android.widget.Toast.LENGTH_LONG).show();
                    }
                }
            }
        ));
    }

    /**
     * Creates map fragment.
     */
    private getMapFragment(id: number) {
        let mapFragment = new com.here.android.mpa.mapping.MapFragment();
        let transaction = this._context.getFragmentManager().beginTransaction();

        transaction.add(id, mapFragment);
        transaction.commit();
        
        return mapFragment;
    }

    addGestureListeners() {
        this._mapFragment.getMapGesture().addOnGestureListener(
            new com.here.android.mpa.mapping.MapGesture.OnGestureListener({
                onPanStart: (): void => {
                    this.notifyEvent(HereMapsBase.panStartEvent);
                },
                onPanEnd: (): void => {
                    this.notifyEvent(HereMapsBase.panEndEvent);
                },
                onMultiFingerManipulationStart: (): void => {
                    this.notifyEvent(HereMapsBase.multiFingerManipulationStartEvent);
                },
                onMultiFingerManipulationEnd: (): void => {
                    this.notifyEvent(HereMapsBase.multiFingerManipulationEndEvent);
                },
                onMapObjectsSelected: (objects: any[]): boolean => {
                    this.notifyEvent(HereMapsBase.mapObjectsSelectedEvent);
                    return false;
                },
                onTapEvent: (p: android.graphics.PointF): boolean => {
                    this.notifyEvent(HereMapsBase.tapEvent);
                    return false;
                },
                onDoubleTapEvent: (p: android.graphics.PointF): boolean => {
                    this.notifyEvent(HereMapsBase.doubleTapEvent);
                    return false;
                },
                onPinchLocked: (): void => {
                    this.notifyEvent(HereMapsBase.pinchLockedEvent);
                },
                onPinchZoomEvent: (scaleFactor: number, 
                    p: android.graphics.PointF): boolean => {
                    this.notifyEvent(HereMapsBase.pinchZoomEvent);
                    return false;
                },
                onRotateLocked: (): void => {
                    this.notifyEvent(HereMapsBase.rotateLockedEvent);
                },
                onRotateEvent: (rotateAngle: number): boolean => {
                    this.notifyEvent(HereMapsBase.rotateEvent);
                    return false;
                },
                onTiltEvent: (angle: number): boolean => {
                    this.notifyEvent(HereMapsBase.tiltEvent);
                    return false;
                },
                onLongPressEvent: (p: android.graphics.PointF): boolean => {
                    this.notifyEvent(HereMapsBase.longPressEvent);
                    return false;
                },
                onLongPressRelease: (): void => {
                    this.notifyEvent(HereMapsBase.longPressReleaseEvent);
                },
                onTwoFingerTapEvent: (p: android.graphics.PointF): boolean => {
                    this.notifyEvent(HereMapsBase.twoFingerTapEvent);
                    return false;
                },
            }),
        );
    }

    updatePosition() {
        if (!this._map) {
            this._pendingPositionUpdate = true;
            return;
        }

        this._pendingPositionUpdate = false;

        if (!isNaN(this.latitude) && !isNaN(this.longitude)) {
            this._map.setCenter(
                new com.here.android.mpa.common.GeoCoordinate(
                    Number(this.latitude), 
                    Number(this.longitude), 
                    0.0,
                ), 
                com.here.android.mpa.mapping.Map.Animation.NONE,
            );
        }

        if (!isNaN(this.zoom)) {
            this._map.setZoomLevel(Number(this.zoom));
        }
    }

    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void {
        // Attach the owner to nativeView.
        // When nativeView is tapped we get the owning JS object through this field.
        (<any>this.nativeView).owner = this;
        super.initNativeView();
    }

    /**
     * Clean up references to the native view and resets nativeView to its original state.
     * If you have changed nativeView in some other way except through setNative callbacks
     * you have a chance here to revert it back to its original state 
     * so that it could be reused later.
     */
    disposeNativeView(): void {
        // Remove reference from native view to this instance.
        (<any>this.nativeView).owner = null;

        // If you want to recycle nativeView and have modified the nativeView 
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
        super.disposeNativeView();
    }
}

