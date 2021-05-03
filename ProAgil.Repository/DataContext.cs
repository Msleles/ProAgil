using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;


namespace ProAgil.Repository.Data
{
    public class ProAgilContext : DbContext
    {        
        public ProAgilContext(DbContextOptions<ProAgilContext> options): base (options){}
        public DbSet<Evento> Eventos {get;set;}
       
    }
}