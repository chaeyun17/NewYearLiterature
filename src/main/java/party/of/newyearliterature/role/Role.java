package party.of.newyearliterature.role;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

/**
 * Role
 */
@Entity
@Getter
@Setter
@Table(name="tbl_role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;

    @Column(unique = true)
    private String name;

    public Role(String name){
        this.name = name;
    }

    public Role(RoleBasicType type){
        this.name = type.getName();
    }

    public Role(){}
}