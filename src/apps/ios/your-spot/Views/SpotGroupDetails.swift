import SwiftUI

struct SpotGroupDetails: View {
    let spotGroup: SpotGroup
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Spot Group IDS")
                    .font(.headline)
                ForEach(spotGroup.spotIds, id: \.self) { spotId in
                    Text(spotId)
                }

                HStack {
                    Text("Location:")
                        .font(.subheadline)
                    Text("Lat: \(String(format: "%.6f", spotGroup.coordinate.lat))")
                    Text("Lng: \(String(format: "%.6f", spotGroup.coordinate.lng))")
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Spot Group Details")
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
