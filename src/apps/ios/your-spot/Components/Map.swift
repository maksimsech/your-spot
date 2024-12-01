import SwiftUI
import MapKit
import os.log

struct MapView: View {
    @State private var position: MapCameraPosition = .userLocation(
        fallback: .camera(
            MapCamera(centerCoordinate: .warsaw, distance: 10000)
        )
    )
    @State private var spots: [Spot] = []
    
    private var debounceWorkItem: DispatchWorkItem?
    private let debounceInterval: TimeInterval = 0.5
    
    // Create an os_log object for structured logging (optional, for better control)
    private let logger = Logger(subsystem: "com.your-app.MapView", category: "APICaller")
  
    
    var body: some View {
        Map(position: $position) {
            ForEach(spots, id: \.id) { spot in
                Marker(
                    coordinate: CLLocationCoordinate2D(
                        latitude: spot.coordinate.lat,
                        longitude: spot.coordinate.lng
                    ),
                    label: { Text("") }
                )
            }
        }
        .onMapCameraChange { context in
            let bounds = getBounds(from: context.region)
            Task {
                let spotResult = await getSpots(for: bounds)
                spots = spotResult.spots
            }
        }
    }
    func getBounds(from region: MKCoordinateRegion) -> Bounds {
        let center = region.center
        let latDelta = region.span.latitudeDelta / 2
        let lonDelta = region.span.longitudeDelta / 2
        
        let southWest = Coordinate(lat: center.latitude - latDelta, lng: center.longitude - lonDelta)
        let northEast = Coordinate(lat: center.latitude + latDelta, lng: center.longitude + lonDelta)
        let northWest = Coordinate(lat: center.latitude + latDelta, lng: center.longitude - lonDelta)
        let southEast = Coordinate(lat: center.latitude - latDelta, lng: center.longitude + lonDelta)
        
        return .init(southWest: southWest, northEast: northEast, northWest: northWest, southEast: southEast)
    }
    
    func getSpots(for bounds: Bounds) async -> SpotsResult {
        let url = URL(string: "http://localhost:3000/api/map/spots")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
                
        let json = SpotsRequest(bounds: bounds, zoom: 5)
        let jsonData = try! JSONEncoder().encode(json)
        request.httpBody = jsonData
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
         
        let (data, response) = try! await URLSession.shared.data(for: request)
        guard let response = response as? HTTPURLResponse, response.statusCode == 200 else {
            return .init(spots: [], spotGroups: [])
        }
        
        do {
            let spots: SpotsResult = try JSONDecoder().decode(SpotsResult.self, from: data)
            return spots
        } catch {
            return .init(spots: [], spotGroups: [])
        }
    }
}

struct SpotsRequest : Codable {
    let bounds: Bounds
    let zoom: Double
}

struct Coordinate : Codable {
    let lat: Double
    let lng: Double
}

struct Spot : Codable {
    let id: String
    let coordinate: Coordinate
}

struct SpotGroup : Codable {
    let spotIds: [String]
    let coordinate: Coordinate
}

struct SpotsResult : Codable {
    let spots: [Spot]
    let spotGroups: [SpotGroup]
}

struct Bounds : Codable {
    let southWest: Coordinate
    let northEast: Coordinate
    let northWest: Coordinate
    let southEast: Coordinate
}

extension CLLocationCoordinate2D {
    static let warsaw: Self = .init(latitude: 52.237049, longitude: 21.017532)
}
