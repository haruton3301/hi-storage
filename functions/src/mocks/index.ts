import bcrypt from "bcryptjs"
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "firebase-admin/firestore"
import { Request } from "firebase-functions/https"
import { Mock, vi } from "vitest"

const password = "password123"
const hashedPassword = bcrypt.hashSync(password, 10)

export const mockDoc = {
  id: "mockId",
  exists: true,
  data: vi.fn().mockReturnValue({
    password: hashedPassword,
    storagePath: "path/to/file",
  }),
} as Partial<DocumentSnapshot<DocumentData>>

export const mockFirestore = {
  collection: vi
    .fn<(id: string) => CollectionReference>()
    .mockImplementation((id: string) => {
      if (id === "files") {
        return {
          doc: vi
            .fn<(id: string) => DocumentReference<DocumentData>>()
            .mockImplementation((id: string) => {
              if (id === "mockId") {
                return {
                  get: vi
                    .fn<() => Promise<DocumentSnapshot<DocumentData>>>()
                    .mockResolvedValue(
                      mockDoc as DocumentSnapshot<DocumentData>,
                    ),
                } as unknown as DocumentReference<DocumentData>
              } else {
                return {
                  get: vi
                    .fn<() => Promise<DocumentSnapshot<DocumentData>>>()
                    .mockResolvedValue({
                      exists: false,
                      data: vi.fn(),
                    } as unknown as DocumentSnapshot<DocumentData>),
                } as unknown as DocumentReference<DocumentData>
              }
            }) as Mock<(id: string) => DocumentReference<DocumentData>>,
        } as unknown as CollectionReference
      }
      return {} as unknown as CollectionReference
    }) as Mock<(id: string) => CollectionReference>,
}

export const mockStorage = {
  bucket: vi.fn(() => ({
    file: vi.fn(() => ({
      getSignedUrl: vi
        .fn<() => Promise<string[]>>()
        .mockResolvedValue(["signedUrl"]),
    })),
  })),
}

export const createMockRequest = (fileId: string, password: string): Request =>
  ({
    body: {
      fileId,
      password,
    },
  }) as Request
