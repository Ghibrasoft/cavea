type selectType = {
    setValue: React.Dispatch<React.SetStateAction<string>>;
}


export function FilterSelect({setValue}: selectType) {

    return (
        <div>
            <select className="form-select" onChange={(e) => setValue(e.target.value) }>
                <option value="all">ყველა</option>
                <option value="headOffice">მთავარი ოფისი</option>
                <option value="caveaGallery">კავეა გალერეა</option>
                <option value="caveaTbilisiMall">კავეა თბილისი მოლი</option>
                <option value="caveaEastPoint">კავეა ისთ ფოინთი</option>
                <option value="caveaCityMall">კავეა სითი მოლი</option>
            </select>
        </div>
    )
}
