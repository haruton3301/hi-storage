import { jest } from "@jest/globals"
import bcrypt from "bcryptjs"
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "firebase-admin/firestore"
import { Request } from "firebase-functions/https"

const password = "password123"
const hashedPassword = bcrypt.hashSync(password, 10)

export const mockDoc = {
  id: "mockId",
  exists: true,
  data: jest.fn().mockReturnValue({
    password: hashedPassword,
    storagePath: "path/to/file",
  }),
} as Partial<DocumentSnapshot<DocumentData>>

export const mockFirestore = {
  collection: jest
    .fn<(id: string) => CollectionReference>()
    .mockImplementation((id: string) => {
      if (id === "files") {
        return {
          doc: jest
            .fn<(id: string) => DocumentReference<DocumentData>>()
            .mockImplementation((id: string) => {
              if (id === "mockId") {
                return {
                  get: jest
                    .fn<() => Promise<DocumentSnapshot<DocumentData>>>()
                    .mockResolvedValue(
                      mockDoc as DocumentSnapshot<DocumentData>,
                    ),
                } as unknown as DocumentReference<DocumentData>
              } else {
                return {
                  get: jest
                    .fn<() => Promise<DocumentSnapshot<DocumentData>>>()
                    .mockResolvedValue({
                      exists: false,
                      data: jest.fn(),
                    } as unknown as DocumentSnapshot<DocumentData>),
                } as unknown as DocumentReference<DocumentData>
              }
            }) as jest.Mock<(id: string) => DocumentReference<DocumentData>>,
        } as unknown as CollectionReference
      }
      return {} as unknown as CollectionReference
    }) as jest.Mock<(id: string) => CollectionReference>,
}

export const mockStorage = {
  bucket: jest.fn(() => ({
    file: jest.fn(() => ({
      getSignedUrl: jest
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
