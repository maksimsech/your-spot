import SwiftUI

struct SpotDetails: View {
    let spot: Spot
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Spot ID: \(spot.id)")
                    .font(.headline)

                HStack {
                    Text("Location:")
                        .font(.subheadline)
                    Text("Lat: \(String(format: "%.6f", spot.coordinate.lat))")
                    Text("Lng: \(String(format: "%.6f", spot.coordinate.lng))")
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Spot Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
        }
    }
}
