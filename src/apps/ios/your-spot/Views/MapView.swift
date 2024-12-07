import MapKit
import SwiftUI
import os.log

class MapViewModel: ObservableObject {
    @Published var position: MapCameraPosition = .userLocation(
        fallback: .camera(
            MapCamera(centerCoordinate: .warsaw, distance: 10000)
        )
    )
    @Published var spots: [Spot] = []
    @Published var selectedSpot: Spot?
    var showingSpotDetails: Bool {
        get { selectedSpot != nil }
    }

    private var debounceWorkItem: DispatchWorkItem?
    private let debounceInterval: TimeInterval = 0.5
    private let logger = Logger(subsystem: "com.your-app.MapView", category: "APICaller")
    private let spotService: SpotServiceProtocol

    init() {
        spotService = SpotService()
    }

    func handleMapCameraChange(region: MKCoordinateRegion) {
        debounceWorkItem?.cancel()

        var workItem: DispatchWorkItem?
        workItem = DispatchWorkItem { [weak self] in
            guard let self = self else { return }
            let bounds = self.getBounds(from: region)

            Task { @MainActor [workItem] in
                let spotResult = await self.spotService.getSpots(for: bounds)
                if let currentWorkItem = workItem, !currentWorkItem.isCancelled {
                    self.spots = spotResult.spots
                }
            }
        }

        debounceWorkItem = workItem

        guard let workItem = workItem else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + debounceInterval, execute: workItem)
    }

    func getBounds(from region: MKCoordinateRegion) -> Bounds {
        let center = region.center
        let latDelta = region.span.latitudeDelta / 2
        let lonDelta = region.span.longitudeDelta / 2

        let southWest = Coordinate(
            lat: center.latitude - latDelta,
            lng: center.longitude - lonDelta
        )
        let northEast = Coordinate(
            lat: center.latitude + latDelta,
            lng: center.longitude + lonDelta
        )
        let northWest = Coordinate(
            lat: center.latitude + latDelta,
            lng: center.longitude - lonDelta
        )
        let southEast = Coordinate(
            lat: center.latitude - latDelta,
            lng: center.longitude + lonDelta
        )

        return .init(
            southWest: southWest,
            northEast: northEast,
            northWest: northWest,
            southEast: southEast
        )
    }
}

struct MapView: View {
    @StateObject private var viewModel = MapViewModel()

    var body: some View {
        Map(position: $viewModel.position) {
            ForEach(viewModel.spots, id: \.id) { spot in
                Marker(
                    coordinate: CLLocationCoordinate2D(
                        latitude: spot.coordinate.lat,
                        longitude: spot.coordinate.lng
                    ),
                    label: { Text("") }
                )
                .tag(spot.id)
            }
        }
        .onMapCameraChange { context in
            viewModel.handleMapCameraChange(region: context.region)
        }
        .sheet(item: $viewModel.selectedSpot) { spot in
            SpotDetails(spot: spot)
        }
    }
}

extension CLLocationCoordinate2D {
    static let warsaw: Self = .init(latitude: 52.237049, longitude: 21.017532)
}
