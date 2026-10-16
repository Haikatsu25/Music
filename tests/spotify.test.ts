import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buscarEnSpotify, enriquecer, reiniciarTokenParaPruebas } from "@/lib/spotify";

const pista = {
  id: "abc123",
  name: "Affection",
  artists: [{ name: "Jinsang" }],
  album: { images: [{ url: "grande" }, { url: "mediana" }, { url: "chica" }] },
};

function respuesta(cuerpo: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => cuerpo } as Response;
}

beforeEach(() => {
  process.env.SPOTIFY_CLIENT_ID = "id";
  process.env.SPOTIFY_CLIENT_SECRET = "secreto";
  reiniciarTokenParaPruebas();
});
afterEach(() => vi.unstubAllGlobals());

describe("buscarEnSpotify", () => {
  it("devuelve id y portada de la primera coincidencia", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respuesta({ access_token: "tok", expires_in: 3600 }))
      .mockResolvedValueOnce(respuesta({ tracks: { items: [pista] } }));
    vi.stubGlobal("fetch", fetchMock);

    const r = await buscarEnSpotify("Affection", "Jinsang");
    expect(r).toEqual({ id: "abc123", portada: "mediana" });
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer tok");
  });

  it("devuelve null si no hay resultados", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(respuesta({ access_token: "tok", expires_in: 3600 }))
        .mockResolvedValue(respuesta({ tracks: { items: [] } })),
    );
    expect(await buscarEnSpotify("Cancion inventada", "Nadie")).toBeNull();
  });

  it("reutiliza el token entre búsquedas", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respuesta({ access_token: "tok", expires_in: 3600 }))
      .mockResolvedValue(respuesta({ tracks: { items: [pista] } }));
    vi.stubGlobal("fetch", fetchMock);
    await buscarEnSpotify("a", "b");
    await buscarEnSpotify("c", "d");
    const llamadasToken = fetchMock.mock.calls.filter((c) => String(c[0]).includes("accounts.spotify.com"));
    expect(llamadasToken).toHaveLength(1);
  });

  it("devuelve null si Spotify falla", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(respuesta({ access_token: "tok", expires_in: 3600 }))
        .mockResolvedValue(respuesta({}, false, 429)),
    );
    expect(await buscarEnSpotify("a", "b")).toBeNull();
  });
});

describe("enriquecer", () => {
  const items = [{ cancion: "Affection", artista: "Jinsang", motivo: "m" }];

  it("sin credenciales devuelve las canciones tal cual y verificado=false", async () => {
    delete process.env.SPOTIFY_CLIENT_ID;
    const r = await enriquecer(items);
    expect(r).toEqual({ recomendaciones: items, verificado: false });
  });

  it("con credenciales añade spotifyId y portada", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(respuesta({ access_token: "tok", expires_in: 3600 }))
        .mockResolvedValue(respuesta({ tracks: { items: [pista] } })),
    );
    const r = await enriquecer(items);
    expect(r.verificado).toBe(true);
    expect(r.recomendaciones[0]).toMatchObject({ spotifyId: "abc123", portada: "mediana" });
  });
});
