using Microsoft.EntityFrameworkCore;
using Model;

namespace Data
{
    public class DataContext : DbContext
    {        
        public DataContext(DbContextOptions<DataContext> options): base (options){}
        public DbSet<Evento> Eventos {get;set;}
       
    }
}