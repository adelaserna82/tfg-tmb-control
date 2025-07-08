using TmbControl.Modules.Sites.Entities;

namespace TmbControl.Modules.Sites.Persistence;

public static class SitesDbContextSeeder
{
    public static async Task SeedAsync(SitesDbContext context)
    {
        if (!context.Sites.Any())
        {
            context.Sites.AddRange(
                new Site { Id = Guid.NewGuid(), Name = "EPIs", Href = "https://epis.autobar-spain.net/semsivprotec/", Description = "Compra de EPIs" },
                new Site { Id = Guid.NewGuid(), Name = "PRL", Href = "https://6conecta.com/es", Description = "PRL descripción" },
                new Site { Id = Guid.NewGuid(), Name = "Volante Mutua", Href = "https://www.mc-mutual.com/solicitud-volante-asistencial", Description = "Solicitar volante para mútua" },
                new Site { Id = Guid.NewGuid(), Name = "Control fichajes", Href = "http://192.168.71.13/#/login", Description = "Control de fichajes" },
                new Site { Id = Guid.NewGuid(), Name = "CAE", Href = "https://www.coordinaplus.net/Login.aspx", Description = "CAE" },
                new Site { Id = Guid.NewGuid(), Name = "Formación", Href = "https://prezero360.grupohedima.com/login?back_url=https%3A%2F%2Fprezero360.grupohedima.com%2F", Description = "Formación" },
                new Site { Id = Guid.NewGuid(), Name = "Mantenimiento", Href = "http://192.168.71.15:8069/", Description = "Mantenimiento" },
                new Site { Id = Guid.NewGuid(), Name = "Control plagas (DDD)", Href = "https://portalclientes.ezsa.es/", Description = "Control de plagas" },
                new Site { Id = Guid.NewGuid(), Name = "Vigilancia de la salud", Href = "https://b2cqcorppro.b2clogin.com/b2cqcorppro.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_QP_Brand_MFA_Si&client_id=5587a9c6-437c-4977-902f-9a89b2b4e9b3&nonce=anyRandomValue&redirect_uri=https://areaclientes.quironprevencion.com/QP_Connector/Callback.aspx&scope=openid%20https://b2cqcorppro.onmicrosoft.com/ClienteMVC/user_impersonation&response_type=code&prompt=login&state=d262e8d8-4688-4a04-8805-e425961d0c6a", Description = "Vigilancia de la salud (Quirón prevención)" },
                new Site { Id = Guid.NewGuid(), Name = "eSIR - Notificación traslado ", Href = "https://sede.miteco.gob.es/portal/site/seMITECO/ficha-procedimiento?procedure_suborg_responsable=11&procedure_etiqueta_pdu=null&procedure_id=736", Description = "eSir -> Notificación traslado" },
                new Site { Id = Guid.NewGuid(), Name = "eSIR - DI ", Href = "https://servicio.mapa.gob.es/sso/login?service=https%3A%2F%2Fservicio.mapa.gob.es%2Fesir-web-adv%2Flogin%2Fcas", Description = "eSir -> DI" }
            );
        }

        await context.SaveChangesAsync();
    }
}
