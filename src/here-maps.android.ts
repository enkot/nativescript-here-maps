import { Common } from './here-maps.common';

declare const com: any;

const { OnEngineInitListener, GeoCoordinate } = com.here.android.mpa.common;
const { MapFragment } = com.here.android.mpa.mapping;
const { ContentLayout } = org.nativescript.widgets;
const { Map } = com.here.android.mpa.mapping;

export class HereMaps extends Common {
    // added for TypeScript intellisense.
    nativeView: org.nativescript.widgets.ContentLayout;

    /**
     * Creates map fragment.
     */
    private getMapFragment(id: number) {
        let mapFragment = new MapFragment();
        let transaction = this._context.getFragmentManager().beginTransaction();

        transaction.add(id, mapFragment);
        transaction.commit();
        
        return mapFragment;
    }

    /**
     * Creates new native map.
     */
    public createNativeView(): Object {
        const nativeView = new ContentLayout(this._context);
        const id = android.view.View.generateViewId();
        const mapFragment = this.getMapFragment(id);

        nativeView.setId(id);
        mapFragment.init(this._context, new OnEngineInitListener({
                onEngineInitializationCompleted(error) {
                    if (error === OnEngineInitListener.Error.NONE) {
                        // retrieve a reference of the map from the map fragment
                        const map = mapFragment.getMap();

                        map.setCenter(new GeoCoordinate(49.5535, 25.5948, 0.0), Map.Animation.NONE);
                        map.setZoomLevel(15);
                    } else {
                        console.error("ERROR: Cannot initialize Map Fragment");
                    }
                }
            }
        ));
        
        return nativeView;
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
