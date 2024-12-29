import MapKit
import SwiftUI
import os.log

enum SelectedItem: Identifiable {
    public var id: String {
        switch self {
        case .spot(let spot):
            return spot.id
        case .spotGroup(let spotGroup):
            return spotGroup.id
        case .coordinate(let coordinate):
            return "\(coordinate.lat),\(coordinate.lng)"
        }
    }

    case spot(Spot)
    case spotGroup(SpotGroup)
    case coordinate(Coordinate)
}

class MapViewModel: ObservableObject {
    @Published var position: MapCameraPosition = .userLocation(
        fallback: .camera(
            MapCamera(centerCoordinate: .warsaw, distance: 10000)
        )
    )
    @Published var spots: [Spot] = []
    @Published var spotGroups: [SpotGroup] = []
    @Published var selectedItem: SelectedItem?
    @Published var selectedCoordinate: Coordinate?

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
                    self.spotGroups = spotResult.spotGroups
                }
            }
        }

        debounceWorkItem = workItem

        guard let workItem = workItem else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + debounceInterval, execute: workItem)
    }

    private func getBounds(from region: MKCoordinateRegion) -> Bounds {
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
        MapReader { reader in
            Map(position: $viewModel.position) {
                ForEach(viewModel.spots, id: \.id) { spot in
                    Annotation("", coordinate: CLLocationCoordinate2D(latitude: spot.coordinate.lat, longitude: spot.coordinate.lng)) {
                        Image(systemName: "mappin.circle.fill")
                            .foregroundColor(.accentColor)
                            .font(.title)
                            .onTapGesture {
                                viewModel.selectedItem = .spot(spot)
                            }
                    }
                }
                ForEach(viewModel.spotGroups, id: \.id) { spotGroup in
                    Annotation("", coordinate: CLLocationCoordinate2D(latitude: spotGroup.coordinate.lat, longitude: spotGroup.coordinate.lng)) {
                        Image(systemName: "mappin.circle.fill")
                            .foregroundColor(.secondary)
                            .font(.title)
                            .onTapGesture {
                                viewModel.selectedItem = .spotGroup(spotGroup)
                            }
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                if let selectedCoordinate = viewModel.selectedCoordinate {
                    Button(action: {
                        viewModel.selectedItem = .coordinate(selectedCoordinate)
                        viewModel.selectedCoordinate = nil
                    }) {
                        Text("Add Spot")
                    }
                }
            }
            .onTapGesture { screenCoordinate in
                if viewModel.selectedCoordinate != nil {
                    viewModel.selectedCoordinate = nil
                    return
                }

                let pl = reader.convert(screenCoordinate, from: .local)
                guard let pl = pl else { return }
                viewModel.selectedCoordinate = .init(
                    lat: pl.latitude,
                    lng: pl.longitude
                )
            }
            .onMapCameraChange { context in
                viewModel.handleMapCameraChange(region: context.region)
            }
            .sheet(item: $viewModel.selectedItem) { item in
                switch item {
                case .spot(let spot):
                    SpotDetails(spot: spot)
                case .spotGroup(let spotGroup):
                    SpotGroupDetails(spotGroup: spotGroup)
                case .coordinate(let coordinate):
                    NewSpot(coordinate: coordinate)
                }
            }
        }
    }
}

extension CLLocationCoordinate2D {
    static let warsaw: Self = .init(latitude: 52.237049, longitude: 21.017532)
}
