import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { HelloWorldModel } from './main-view-model';

const gestureListeners = {
    onPanStart(): void {
        console.log('pan started');
    },
    onTapEvent(p: android.graphics.PointF) {
        console.log(p);
        return true;
    },
};

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
}

export function onPanStart(): void {
    console.log('pan started');
}

export function onMapReady({ object }: any): void {
}

