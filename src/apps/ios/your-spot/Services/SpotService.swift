import Foundation

public protocol SpotServiceProtocol {
    func getSpots(for bounds: Bounds) async -> SpotsResult
}

public class SpotService: SpotServiceProtocol {
    private let baseURL = "http://localhost:3000"

    public func getSpots(for bounds: Bounds) async -> SpotsResult {
        let url = URL(string: "\(baseURL)/api/map/spots")!
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

public struct SpotsRequest: Codable {
    public let bounds: Bounds
    public let zoom: Double
}

public struct Coordinate: Codable {
    public let lat: Double
    public let lng: Double
}

public struct Spot: Codable, Identifiable {
    public let id: String
    public let coordinate: Coordinate
}

public struct SpotGroup: Codable {
    public let spotIds: [String]
    public let coordinate: Coordinate
}

public struct SpotsResult: Codable {
    public let spots: [Spot]
    public let spotGroups: [SpotGroup]
}

public struct Bounds: Codable {
    public let southWest: Coordinate
    public let northEast: Coordinate
    public let northWest: Coordinate
    public let southEast: Coordinate
}
